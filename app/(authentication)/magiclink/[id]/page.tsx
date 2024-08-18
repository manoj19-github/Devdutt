import React, { FC } from "react";

type MagicLinkPageProps = {
  params: {
    id: string;
  };
};
const MagicLinkPage: FC<MagicLinkPageProps> = ({ params }) => {
  console.log("params  >>>>>>>>>>>", params);

  return <div>MagicLinkPage</div>;
};

export default MagicLinkPage;
