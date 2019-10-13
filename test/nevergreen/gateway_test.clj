(ns nevergreen.gateway-test
  (:require [clojure.test :refer :all]
            [nevergreen.gateway :as subject])
  (:import (java.net UnknownHostException URISyntaxException ConnectException SocketTimeoutException)
           (org.apache.http.concurrent BasicFuture FutureCallback)
           (org.apache.http.message BasicHttpResponse BasicStatusLine)
           (org.apache.http HttpVersion)
           (org.apache.http.entity StringEntity)
           (java.util.concurrent TimeoutException TimeUnit Future)
           (java.io ByteArrayInputStream)))


(defn- completed-future [result]
  (let [future-call-back (reify FutureCallback
                           (completed [_ _])
                           (failed [_ _])
                           (cancelled [_]))
        basic-future (BasicFuture. future-call-back)
        status-line (BasicStatusLine. HttpVersion/HTTP_0_9 200 "OK")
        response (BasicHttpResponse. status-line)]
    (.setEntity response (StringEntity. result))
    (.completed basic-future response)
    basic-future))

(defn- failed-future [exception]
  (let [future-call-back (reify FutureCallback
                           (completed [_ _])
                           (failed [_ _])
                           (cancelled [_]))
        basic-future (BasicFuture. future-call-back)]
    (.failed basic-future exception)
    basic-future))

(defn string->stream
  ([s] (string->stream s "UTF-8"))
  ([s encoding]
   (-> s
       (.getBytes encoding)
       (ByteArrayInputStream.))))

(deftest http-get
  (testing "adds additional data"
    (binding [subject/client-get (fn [_ data promise]
                                   (is (contains? data :headers))
                                   (is (contains? (:headers data) "Authentication"))
                                   (is (= "Basic some-password" (get (:headers data) "Authentication")))
                                   (deliver promise "result"))]
      (subject/http-get "http://some-url" {:headers {"Authentication" "Basic some-password"}})))

  (testing "returns the body"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (string->stream "some-body")))]
      (is (= "some-body" (slurp (subject/http-get "http://some-url" {}))))))

  (testing "uses the given url"
    (binding [subject/client-get (fn [url _ promise]
                                   (is (= "http://some-url" url))
                                   (deliver promise (string->stream "result")))]
      (subject/http-get "http://some-url" {})))

  (testing "throws an error for unknown hosts"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (UnknownHostException. "some-host: unknown error")))]
      (is (thrown-with-msg? Exception
                            #"some-host is an unknown host, is the URL correct?"
                            (subject/http-get "http://some-host" {})))))

  (testing "throws an error for bad uri syntax"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (URISyntaxException. "some-url" "Illegal character in authority at index 0")))]
      (is (thrown-with-msg? Exception
                            #"URL is invalid. Illegal character in authority at index 0: some-url"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an error for connect exception"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (ConnectException. "Connection refused (Connection refused)")))]
      (is (thrown-with-msg? Exception
                            #"Connection refused, is the URL correct?"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an error when the CI server responds with an error but blank reason phrase"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (ex-info "irrelevant" {:reason-phrase "" :status 404})))]
      (is (thrown-with-msg? Exception
                            #"Server returned a 404"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an error when the CI server responds with an error"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (ex-info "irrelevant" {:reason-phrase "some-error"})))]
      (is (thrown-with-msg? Exception
                            #"Server returned a some-error"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an unknown error when the CI server responds with an error but no reason"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (ex-info "irrelevant" {})))]
      (is (thrown-with-msg? Exception
                            #"Server returned a Unknown error"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an unknown error when SocketTimeoutException exception occurs"
    (binding [subject/client-get (fn [_ _ promise] (deliver promise (SocketTimeoutException. "Timeout occurred")))]
      (is (thrown-with-msg? Exception
                            #"Connection timeout"
                            (subject/http-get "http://some-url" {})))))

  (testing "throws an an error when server did not respond in time and cancel the request"
    (let [call-count (atom 0)
          timeout-future (proxy [Future] []
                           (cancel [interrupt]
                             (is (= true interrupt))
                             (swap! call-count inc)
                             true))]
      (with-redefs [subject/get-result (fn [_ msec timeout-result]
                                         (is (= 50000 msec))
                                         (is (= :deadline-timeout timeout-result))
                                         timeout-result)
                    subject/client-get (constantly timeout-future)]
        (is (thrown-with-msg? Exception
                              #"Deadline timeout"
                              (subject/http-get "http://some-url" {})))
        (is (= 1 @call-count))))))
