import React from "react"

export const FAQ = () => (
  <div className="relative mx-auto w-full px-5 py-16 text-gray-800 sm:px-20 md:max-w-screen-lg lg:py-24">
    <h2 className="text-center mt-6 mb-10 text-3xl font-semibold tracking-wide text-gray-800 sm:text-4xl">
      Have Questions? Checkout these FAQs
    </h2>
    <p className="mb-12 text-center text-lg text-gray-600">
      We have written down answers to some of the frequently asked questions.
      But, if you still have any queries, feel free to get in touch with us.
    </p>
    <ul className="divide-y divide-gray-200">
      <li className="text-left">
        <label htmlFor="accordion-1" className="flex flex-col">
          <input className="peer hidden" type="checkbox" id="accordion-1" />
          <div className="before:absolute before:-left-6 before:block before:text-xl before:text-emerald-400 before:content-['–'] peer-checked:before:content-['+'] relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
            <h3 className="text-sm lg:text-base font-bold">
              What is stateofdev.ma ?
            </h3>
          </div>
          <div className="peer-checked:hidden pr-2">
            <div className="pb-5">
              <p className="text-sm">
                Lorem ipsum, <b>dolor sit amet</b> consectetur adipisicing elit.
                Adipisci eligendi, recusandae voluptatum distinctio facilis
                necessitatibus aperiam ut? Dolor mollitia modi aliquam, non sint
                at reprehenderit commodi dignissimos quo unde asperiores
                officiis quos laboriosam similique nihil.
              </p>
            </div>
          </div>
        </label>
      </li>
      <li className="text-left">
        <label htmlFor="accordion-2" className="flex flex-col">
          <input
            className="peer hidden"
            type="checkbox"
            id="accordion-2"
            defaultChecked={true}
          />
          <div className="before:absolute before:-left-6 before:block before:text-xl before:text-emerald-400 before:content-['–'] peer-checked:before:content-['+'] relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
            <h3 className="text-sm lg:text-base font-bold">
              How is behind this initiative?
            </h3>
          </div>
          <div className="peer-checked:hidden pr-2">
            <div className="pb-5">
              <p className="text-sm">
                Lorem ipsum, <b>dolor sit amet</b> consectetur adipisicing elit.
                Adipisci eligendi, recusandae voluptatum distinctio facilis
                necessitatibus aperiam ut? Dolor mollitia modi aliquam, non sint
                at reprehenderit commodi dignissimos quo unde asperiores
                officiis quos laboriosam similique nihil.
              </p>
            </div>
          </div>
        </label>
      </li>
      <li className="text-left">
        <label htmlFor="accordion-3" className="flex flex-col">
          <input
            className="peer hidden"
            type="checkbox"
            id="accordion-3"
            defaultChecked={true}
          />
          <div className="before:absolute before:-left-6 before:block before:text-xl before:text-emerald-400 before:content-['–'] peer-checked:before:content-['+'] relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
            <h3 className="text-sm lg:text-base font-bold">
              How can I contribute to this initiative?
            </h3>
          </div>
          <div className="peer-checked:hidden pr-2">
            <div className="pb-5">
              <p className="text-sm">
                Lorem ipsum, <b>dolor sit amet</b> consectetur adipisicing elit.
                Adipisci eligendi, recusandae voluptatum distinctio facilis
                necessitatibus aperiam ut? Dolor mollitia modi aliquam, non sint
                at reprehenderit commodi dignissimos quo unde asperiores
                officiis quos laboriosam similique nihil.
              </p>
            </div>
          </div>
        </label>
      </li>
      <li className="text-left">
        <label htmlFor="accordion-4" className="flex flex-col">
          <input
            className="peer hidden"
            type="checkbox"
            id="accordion-4"
            defaultChecked={true}
          />
          <div className="before:absolute before:-left-6 before:block before:text-xl before:text-emerald-400 before:content-['–'] peer-checked:before:content-['+'] relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
            <h3 className="text-sm lg:text-base font-bold">
              When will the results be published?
            </h3>
          </div>
          <div className="peer-checked:hidden pr-2">
            <div className="pb-5">
              <p className="text-sm">
                Lorem ipsum, <b>dolor sit amet</b> consectetur adipisicing elit.
                Adipisci eligendi, recusandae voluptatum distinctio facilis
                necessitatibus aperiam ut? Dolor mollitia modi aliquam, non sint
                at reprehenderit commodi dignissimos quo unde asperiores
                officiis quos laboriosam similique nihil.
              </p>
            </div>
          </div>
        </label>
      </li>
    </ul>
  </div>
)
