import React, { useLayoutEffect, useState } from 'react';
import columnLayoutStyles from './ColumnLayout.module.css';
import SwipeableViews from 'react-swipeable-views';
import { useSelector } from 'react-redux';
import {
    selectColumnLayout,
  } from '../columnLayout/columnLayoutSlice';
import { BackButton } from '../backButton/BackButton';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

// function ShowWindowDimensions(props) {
//   const [width, height] = useWindowSize();
//   return <span>Window size: {width} x {height}</span>;
// }

const styles = {
    slide: {
      padding: '1rem',
      minHeight: 100,
    },
    slide1: {
    },
    slide2: {
    },
};

export function ColumnLayout({leftColumn, rightColumn}) {
    const width = useWindowSize()[0];
    const columnLayout = useSelector(selectColumnLayout);

    if (width > 800) {
        // Desktop layout
        return (
            <div className={columnLayoutStyles.container}>
                <div className={columnLayoutStyles.leftColumn}>
                    {leftColumn}
                </div>
                <div className={columnLayoutStyles.rightColumn}>
                    <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                        {rightColumn}
                    </div>
                </div>
            </div>
        );
    } else {
        // Mobile layout
        return (
            <SwipeableViews index={columnLayout.index} disabled={true}>
                <div style={Object.assign({}, styles.slide, styles.slide1)}>
                    {leftColumn}
                </div>
                <div style={Object.assign({}, styles.slide, styles.slide2)}>
                    <BackButton />
                    {rightColumn}
                </div>
            </SwipeableViews>
        );
    }

}