import { Divider } from "../../../../../components/Divider";
import { Modal } from "../../../../../components/modals/Modal";
import { ModelPrices } from "../ModelPrices";

export const ModelPricesModal = ({ isOpen, setIsOpen, selectedModels }) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Información de los Precios"
      withBackground
    >
      <div className="space-y-4">
        {selectedModels.map((model, index) => (
          <section key={index}>
            <ModelPrices modelSelected={model} />
            {selectedModels?.length > 1 &&
              index < selectedModels.length - 1 && <Divider />}
          </section>
        ))}
      </div>
    </Modal>
  );
};
