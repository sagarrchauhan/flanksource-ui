import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { getConfigChange, getConfig } from "../../api/services/configs";
import { toastError } from "../../components/Toast/toast";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const { setTitle } = useOutletContext();

  useEffect(() => {
    setIsLoading(true);

    getConfigChange(id)
      .then((res) => {
        if (res.data.length === 0) {
          setHistoryData([]);
        } else {
          setHistoryData(res?.data);
        }
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });

    getConfig(id)
      .then((res) => {
        const data = res?.data[0];
        setTitle(
          <BreadcrumbNav
            list={[
              { to: "/configs", title: "Config" },
              <b key="title">{data?.name}</b>
            ]}
          />
        );
      })
      .catch((err) => toastError(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col items-start">
      <ConfigChangeHistory data={historyData} isLoading={isLoading} />
    </div>
  );
}
