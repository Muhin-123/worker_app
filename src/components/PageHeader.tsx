import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({ title, showBack }: Props) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 h-14 bg-primary text-primary-foreground shadow-sm">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full hover:bg-primary/80">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-lg font-semibold truncate">{title}</h1>
    </header>
  );
}
