import { HandHelping } from "lucide-react";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import { FaPrint } from "react-icons/fa";
import { GrUploadOption } from "react-icons/gr";
import { MdModeEdit, MdOutlineFileDownload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

// Uniform wrapper to vertically/horizontally center any icon-like control
const IconWrapper = ({ children, size = 20, onClick, title }) => (
  <span
    className="inline-flex items-center justify-center align-middle"
    style={{ width: size, height: size }}
    onClick={onClick}
    title={title}
  >
    {children}
  </span>
);

const Operation = ({ children, availableIn }) => {
  if (availableIn) {
    return <div className="flex items-center cursor-pointer">{children}</div>;
  }

  return null;
};

export const EditQuote = ({ openModalEdit, quote }) => {
  return (
    <IconWrapper size={20}>
      <MdModeEdit color="green" size={20} onClick={() => openModalEdit(quote)} />
    </IconWrapper>
  );
};

export const DownloadEconomicOffer = ({
  setSelectedItem,
  setOnRenderQuoteOfferPDF,
  quote,
}) => {
  return (
    <IconWrapper size={20}>
      <FaPrint
        color="orange"
        size={20}
        onClick={() => {
          setSelectedItem(quote);
          setOnRenderQuoteOfferPDF(true);
        }}
      />
    </IconWrapper>
  );
};

export const DownloadTechnicalReportOfModels = ({
  setShouldDownload,
  setSelectedItem,
  quote,
}) => {
  return (
    <IconWrapper size={20}>
      <MdOutlineFileDownload
        color="blue"
        size={20}
        onClick={() => {
          setShouldDownload(true);
          setSelectedItem(quote);
        }}
      />
    </IconWrapper>
  );
};

export const DeleteQuote = ({ openModalDelete, quote }) => {
  return (
    <IconWrapper size={20}>
      <RiDeleteBinLine
        color="red"
        size={20}
        onClick={() => openModalDelete(quote)}
      />
    </IconWrapper>
  );
};

export const PromoteToDelivery = ({
  setOpenApproveQuoteModal,
  setSelectedItem,
  quote,
  state,
}) => {
  const checked = React.useMemo(() => state === "EN PEDIDO", [state]);

  const handleCheckboxChange = (e) => {
    if (checked) return;

    setOpenApproveQuoteModal(true);
    setSelectedItem(quote);
  };

  return (
    <IconWrapper size={20}>
      <Checkbox onChange={handleCheckboxChange} checked={checked} />
    </IconWrapper>
  );
};

export const SendToERP = ({
  setOpenSendToERPQuoteModal,
  setSelectedItem,
  quote,
}) => {
  return (
    <IconWrapper size={20}>
      <GrUploadOption
        color="black"
        size={20}
        onClick={() => {
          setOpenSendToERPQuoteModal(true);
          setSelectedItem(quote);
        }}
      />
    </IconWrapper>
  );
};

export const RequireApprovalDiscount = ({
  setOpenApproveDiscountModal,
  setSelectedItem,
  quote,
}) => {
  const handleClick = () => {
    setOpenApproveDiscountModal(true);
    setSelectedItem(quote);
  };

  return (
    <IconWrapper size={20}>
      <HandHelping width={20} height={20} onClick={handleClick} />
    </IconWrapper>
  );
};

export default Operation;

Operation.EditQuote = EditQuote;
Operation.DownloadEconomicOffer = DownloadEconomicOffer;
Operation.DownloadTechnicalReportOfModels = DownloadTechnicalReportOfModels;
Operation.DeleteQuote = DeleteQuote;
Operation.PromoteToDelivery = PromoteToDelivery;
Operation.SendToERP = SendToERP;
Operation.RequireApprovalDiscount = RequireApprovalDiscount;
