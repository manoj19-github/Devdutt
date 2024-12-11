import qs from "query-string";

export const sendMessageHandler = async ({
  apiUrl,
  query,
  content,
  fileUrl,
  successCallback,
  loggedInUserDetails,
  finallyCallback,
  errorCallback,
}: {
  query?: Record<string, any>;
  apiUrl?: string;
  fileUrl?: string | null;
  loggedInUserDetails?: any;
  content?: string;
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/${apiUrl ?? ""}`,
      query,
    });
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        content,
        fileUrl,
        loggedInUserDetails,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      successCallback?.(data);
    } else {
      errorCallback?.();
    }
  } catch (err) {
    console.log(err);
    errorCallback?.(err);
  } finally {
    finallyCallback?.();
  }
};

export const checkSocketConnectionHandler = async ({
  successCallback,
  finallyCallback,
  errorCallback,
}: {
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/socket`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      successCallback?.(data);
    } else {
      errorCallback?.();
    }
  } catch (error) {
    console.log("====================================");
    console.log("error occured >>>>>>>>>>>>>> ", error);
    console.log("====================================");
  } finally {
    finallyCallback?.();
  }
};

export const sendAttachmentHandler = async ({
  query,
  apiUrl,
  messageContent,
  attachment,
  loggedInUserDetails,
  successCallback,
  finallyCallback,
  errorCallback,
}: {
  messageContent?: any;
  attachment?: any;
  query?: Record<string, any>;
  apiUrl?: string;
  loggedInUserDetails?: any;
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/${apiUrl ?? ""}`,
      query,
    });
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        loggedInUserDetails,
        messageContent,
        attachment,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      successCallback?.(data);
    } else {
      errorCallback?.();
    }
  } catch (error) {
    errorCallback?.();
    console.log("====================================");
    console.log("error occured >>>>>>>>>>>>>> ", error);
    console.log("====================================");
  } finally {
    finallyCallback?.();
  }
};
