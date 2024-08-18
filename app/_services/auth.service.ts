export const socialLoginService = async ({
  user,
  account,
  profile,
}: {
  user: any;
  account: any;
  profile: any;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/sociallogin`,
      {
        method: "POST",
        body: JSON.stringify({ user, account, profile }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const linkAccountService = async (user: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/linkaccount`,
      {
        method: "POST",
        body: JSON.stringify({ user }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const sendMailForMagicLinkService = async ({
  email,
}: {
  email: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/sendmailformagiclink`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
