import React from "react";

export const TemplateService = () => {
  const [openAddTemplateModal, setOpenAddTemplateModal] =
    React.useState<boolean>(false);

  return { openAddTemplateModal, setOpenAddTemplateModal };
};
