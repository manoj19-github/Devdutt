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
      `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/socket/io`,
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

export const updateMessageService = async ({
  successCallback,
  errorCallback,
  finallyCallback,
  socketUrl,
  id,
  socketQuery,
  loggedInUserDetails,
  messageContent,
}: {
  id: any;
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
  socketUrl: string;
  socketQuery: Record<string, string>;
  loggedInUserDetails: any;
  messageContent: any;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({
        loggedInUserDetails,
        messageContent,
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
    console.log("error occured >>>>>>>>>> ",error);
    errorCallback?.(error);
  }finally{
    finallyCallback?.();
  }
};





export const deleteMessageService = async ({
  successCallback,
  errorCallback,
  finallyCallback,
  socketUrl,
  socketQuery,
  loggedInUserDetails,
  
}: {
  
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
  socketUrl: string;
  socketQuery: Record<string, string>;
  loggedInUserDetails: any;
}) => {
  try{
    const url = qs.stringifyUrl({
      url: `${socketUrl}`,
      query: socketQuery,
    });

    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify({
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


  }catch(error){
    errorCallback?.();
    console.log("error >>>>>>>>>>>>>>>>",error);
    
  }finally{
    finallyCallback?.();
  }
}

export const getMediaToken = async ({
  successCallback,
  errorCallback,
  finallyCallback,
  chatId,
  name,
}: {
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
  chatId: string;
  name: string;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/livekit`,
      query: {
        room: chatId,
        username: name,
      },
    });
    const response = await fetch(url, {
      method: "GET",
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
  } finally {
    finallyCallback?.();
  }
};