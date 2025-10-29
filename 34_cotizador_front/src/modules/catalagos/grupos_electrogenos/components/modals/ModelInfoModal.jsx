import { Divider } from "../../../../../components/Divider";
import { Modal } from "../../../../../components/modals/Modal";
import { ModelInfo } from "../ModelInfo";

export const ModelInfoModal = ({ isOpen, setIsOpen, selectedModels }) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Información de los Modelos"
      withBackground
      width="max-w-3xl"
    >
      <div className="space-y-4">
        {selectedModels.map((model, index) => (
          <section key={index}>
            <ModelInfo modelSelected={model} setIsOpen={setIsOpen} />
            {selectedModels?.length > 1 &&
              index < selectedModels.length - 1 && <Divider />}
          </section>
        ))}
      </div>
    </Modal>
  );
};
