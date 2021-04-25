import React, { FC, ReactNode, Dispatch, useRef, useEffect } from "react";

function useOutsideListener(ref, updateFunction) {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				updateFunction(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

interface OutsideClickProps {
	children: ReactNode;
	className?: string;
	updateFunction: Dispatch<React.SetStateAction<boolean>>;
}

const OutsideClick: FC<OutsideClickProps> = ({
	children,
	className,
	updateFunction
}: OutsideClickProps) => {
	const wrapperRef = useRef(null);
	useOutsideListener(wrapperRef, updateFunction);

	return (
		<div ref={wrapperRef} className={className}>
			{children}
		</div>
	);
};

export default OutsideClick;
