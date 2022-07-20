import { useCallback, useState } from "react";
import { BiHide, BiZoomIn } from "react-icons/bi";
import { deleteHypothesis, Hypothesis } from "../../../api/services/hypothesis";
import { createIncidentQueryKey } from "../../query-hooks/useIncidentQuery";
import { useQueryClient } from "react-query";
import { IconButton } from "../../IconButton";
import { BsTrash } from "react-icons/bs";
import { HypothesisDeleteDialog } from "../HypothesisDeleteDialog";
import { Menu } from "../../Menu";

interface IProps {
  onDisprove: () => void;
  hypothesis: Hypothesis;
  setDeleting: (state: boolean) => void;
}

export const HypothesisBarMenu = ({
  hypothesis,
  onDisprove: onDisproveCB,
  setDeleting
}: IProps) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onDelete = useCallback(() => {
    setDeleting(true);
    const delHypo = async () => {
      try {
        setShowConfirm(false);
        await deleteHypothesis(hypothesis.id);
        const key = createIncidentQueryKey(hypothesis.incident_id);
        await queryClient.invalidateQueries(key);
        setDeleting(false);
      } catch (e) {
        setShowConfirm(false);
        setDeleting(false);
        console.error("Error while deleting", e);
      }
    };
    delHypo();
  }, [hypothesis, queryClient, setDeleting]);

  const onDisprove = () => {
    onDisproveCB();
    setShowConfirm(false);
  };

  return (
    <>
      <HypothesisDeleteDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onDelete={onDelete}
        onDisprove={onDisprove}
      />
      <Menu>
        <Menu.VerticalIconButton />
        <Menu.Items>
          <Menu.Item onClick={() => setShowConfirm(true)}>
            <IconButton
              className="bg-transparent flex items-center"
              ovalProps={{
                stroke: "blue",
                height: "18px",
                width: "18px",
                fill: "transparent"
              }}
              icon={
                <BsTrash
                  className="text-gray-600 border-0 border-l-1 border-gray-200"
                  size={18}
                />
              }
            />
            <span className="pl-2 text-sm block">Delete hypothesis</span>
          </Menu.Item>

          <Menu.Item>
            <BiZoomIn />
            <span className="pl-2 text-sm block">Add solution</span>
          </Menu.Item>

          <Menu.Item>
            <BiHide />
            <span className="pl-2 text-sm block">Edit title</span>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
};
