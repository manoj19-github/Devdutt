import { useEffect, useState } from "react";

const useOriginHandler = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  if (!mounted) return "";
  return origin;
};

export default useOriginHandler;
