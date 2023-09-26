import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

function WrapperHoverAction({ dataSource, children, width = 150 }) {
  const refWrapper = useRef();
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const bodyTable = refWrapper.current.querySelector('.ivnd-table-body');
    const colgroup = bodyTable.querySelector('colgroup');
    const col = colgroup.querySelectorAll('col');
    col[col.length - 1].style.width = '0px';
    if (dataSource) {
      const handleHover = () => {
        const scrollBarWidth = bodyTable.scrollLeft;
        setScrollLeft(bodyTable.offsetWidth + scrollBarWidth - width);
      };

      handleHover();

      bodyTable.addEventListener('scroll', handleHover);

      const observer = new ResizeObserver(handleHover);
      observer.observe(bodyTable);
      bodyTable.addEventListener('scroll', handleHover);
      return () => {
        bodyTable.removeEventListener('scroll', handleHover);
        observer.disconnect();
      };
    }
  }, [dataSource]);

  return (
    <StyleTable ref={refWrapper} scrollLeft={scrollLeft} width={width}>
      {children}
    </StyleTable>
  );
}

export default WrapperHoverAction;

const StyleTable = styled.div`
  th ~ .cell-hidden {
    display: none !important;
  }

  td ~ .cell-hidden {
    position: absolute !important;
    display: none !important;
    align-items: center !important;
    left: ${({ scrollLeft }) => scrollLeft}px !important;
    top: 0 !important;
    bottom: 0 !important;
    right: initial !important;
    // width: ${({ width }) => width}px !important;
  }
  .ivnd-table-row {
    position: relative !important;
  }
  .ivnd-table-row:hover {
    td ~ .cell-hidden {
      display: flex !important;
      align-items: center !important;
    }
  }
`;
