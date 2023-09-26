import processApi from 'api/processApi';
import { useEffect, useRef, useState } from 'react';

function useLoadMore({ payload }) {
  const ref = useRef();
  // const isFirstCall = useRef(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const isScroll = useRef(false);
  const totalPages = useRef();
  const isLoadMore = useRef(false);
  const [payloadScroll, setPayloadScroll] = useState({
    ...payload,
    page: 1,
    pageSize: 20,
  });

  const fetchData = async () => {
    try {
      if (!isLoadMore.current) setLoading(true);
      const { data } = await processApi.getInboxMeScroll(payloadScroll);
      totalPages.current = data?.pagesAvailable;
      if (isLoadMore.current) {
        return setDataSource(prevData => [...prevData, ...data.pageItems]);
      }
      setDataSource(data.pageItems);
    } catch (error) {
      console.log(error);
    } finally {
      isScroll.current = false;
      isLoadMore.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!payload) return;
    isLoadMore.current = false;
    setPayloadScroll(prevData => ({
      ...prevData,
      ...payload,
      page: 1,
    }));
  }, [payload]);

  useEffect(() => {
    fetchData();
  }, [payloadScroll]);

  const onScrollY = () => {
    if (!isScroll.current) {
      isScroll.current = true;
      isLoadMore.current = true;
      setPayloadScroll(prevData => {
        if (totalPages.current === prevData.page) {
          return prevData;
        }
        return {
          ...prevData,
          page: prevData.page + 1,
        };
      });
    }
  };
  useEffect(() => {
    const bodyTable = ref.current.querySelector('.ivnd-table-body');
    let prevScrollY = 0;
    if (dataSource) {
      bodyTable.addEventListener('scroll', event => {
        const maxScroll = event.target.scrollHeight - event.target.clientHeight;
        const currentScroll = event.target.scrollTop;
        if (prevScrollY !== bodyTable.scrollTop) {
          prevScrollY = bodyTable.scrollTop;
        }
        if (currentScroll === maxScroll) {
          onScrollY();
        }
      });
      return () => {
        bodyTable.removeEventListener('scroll', onScrollY);
      };
    }
  }, [dataSource]);

  return { loading, dataSource, ref };
}

export default useLoadMore;
