import { Divider } from "../../../../../components/Divider";
import { Modal } from "../../../../../components/modals/Modal";
import { AlternatorInfo } from "../AlternatorInfo";

export const AlternatorInfoModal = ({ isOpen, setIsOpen, selectedModels }) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Información de los Alternadores"
      withBackground
      width="max-w-4xl"
    >
      <div className="space-y-4">
        {selectedModels.map((model, index) => (
          <section key={index}>
            <AlternatorInfo modelSelected={model} />
            {selectedModels?.length > 1 &&
              index < selectedModels.length - 1 && <Divider />}
          </section>
        ))}
      </div>
    </Modal>
  );
};
