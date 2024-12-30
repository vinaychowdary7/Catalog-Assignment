import React, { useEffect, useRef, useState } from 'react';

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, setSelectedTab }) => {
    activeTabLineRef = useRef();
    activeTabRef = useRef();

    const [inPageNavIndex, setInPageNavIndex] = useState(1);

    const changePageState = (btn, i) => {
        const { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + 'px';
        activeTabLineRef.current.style.left = offsetLeft + 'px';
        activeTabLineRef.current.style.backgroundColor = '#4b40ee';

        setInPageNavIndex(i);
        setSelectedTab(i);
    };

    useEffect(() => {
        changePageState(activeTabRef.current, 1);
    }, []);

    return (
        <div className='relative bg-white border-b border-grey flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2'>
            <div className='sm:ml-10 flex flex-wrap justify-center sm:justify-start'>
                {routes.map((route, i) => (
                    <button
                        ref={i === 1 ? activeTabRef : null}
                        key={i}
                        className={`p-4 px-5 capitalize ${inPageNavIndex === i ? 'text-black' : 'text-gray-500'} sm:text-base text-sm ${i >= routes.length - 3 ? "hidden sm:block" : ""}`}
                        onClick={(e) => { changePageState(e.target, i); }}
                    >
                        {route}
                    </button>
                ))}
            </div>

            <hr
                ref={activeTabLineRef}
                className="absolute bottom-0 duration-300"
                style={{
                    backgroundColor: '#4b40ee',
                    height: '4px',
                    width: '100%',
                }}
            ></hr>
        </div>
    );
};

export default InPageNavigation;
