import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GoBackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => navigate("/conversation")}
      className="flex md:hidden">
      <ChevronLeftIcon className="min-w-6 min-h-6" />
    </Button>
  );
}
