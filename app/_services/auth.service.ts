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

export const emailloginService = async (email: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/emaillogin`,
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

export const emailloginServiceForCredentials = async (email: string) => {
  try {
    console.log("emailloginServiceForCredentials  >>>>>> ", email);

    await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/emaillogin/credentials`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error in credentails api ", error);
    return error;
  }
};

export const checkVerificationToken = async (verificationToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/registration/verificationtoken`,
      {
        method: "POST",
        body: JSON.stringify({ verificationToken }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log("error in credentails api ", error);
    return error;
  }
};