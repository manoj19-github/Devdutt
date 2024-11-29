import { MemberRole } from "@prisma/client";
import qs from "query-string";

export const roleChangeHandler = async ({
  memberId,
  role,
  workspaceId,
  successCallback,
  finallyCallback,
  errorCallback,
}: {
  memberId: string;
  workspaceId: string;
  role: MemberRole;
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/members/${memberId}`,
      query: {
        workspaceId,
        memberId,
      },
    });
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ role }),
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

export const kickOutHandler = async ({
  memberId,
  workspaceId,
  successCallback,
  finallyCallback,
  errorCallback,
}: {
  memberId: string;
  workspaceId: string;
  successCallback?: (args?: any) => void;
  errorCallback?: (args?: any) => void;
  finallyCallback?: (args?: any) => void;
}) => {
  try {
    const url = qs.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_CURRENT_ORIGIN}/api/members/${memberId}`,
      query: {
        workspaceId,
      },
    });
    const response = await fetch(url, {
      method: "DELETE",
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
