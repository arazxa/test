import React from "react";
import Layout from "../components/layout/Layout";
import Link from "next/link";
import Mintbtn from "./mintbtn";

const Login = () => {
  return (
    <>
      <Layout>
        <section className="relative pb-20">
          <div className="hidden lg:block absolute inset-0 w-1/2 ml-auto">
            <div
              className="flex items-center h-full wow animate__animated animate__fadeIn animated"
              data-wow-delay=".1s"
            >
              <img
                className="lg:max-w-lg mx-auto"
                src="/assets/imgs/illustrations/space.svg"
                alt="Monst"
              />
            </div>
          </div>
          <div className="container">
            <div className="relative flex flex-wrap pt-12">
              <div className="lg:flex lg:flex-col w-full lg:w-1/2 py-6 lg:pr-20">
                <div
                  className="w-full max-w-lg mx-auto lg:mx-0 my-auto wow animate__animated animate__fadeIn animated"
                  data-wow-delay=".3s"
                >
                  <span className="text-sm text-blueGray-400">Sign In</span>
                  <h4 className="mb-6 text-3xl">Join our community</h4>

                  <Mintbtn />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Login;
