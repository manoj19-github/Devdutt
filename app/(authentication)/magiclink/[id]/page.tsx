import {
  checkVerificationToken,
  emailloginServiceForCredentials,
} from "@/app/_services/auth.service";
import Typography from "@/lib/Typography";
import { DEFAULT_CREDENTIALS_LOGIN_REDIRECT } from "@/routes";
import { signIn, useSession } from "next-auth/react";

import React, { FC, useEffect, useState } from "react";
import UserInfo from "./_component/UserInfo";
import { useParams } from "next/navigation";

type MagicLinkPageProps = {};
const MagicLinkPage: FC<MagicLinkPageProps> = () => {
  return <UserInfo />;
};

export default MagicLinkPage;
