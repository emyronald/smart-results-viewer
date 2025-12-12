import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";
import BlurText from "@/components/BlurText";

interface Props {
  text: string;
}

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
      <div className="flex flex-col items-center justify-between p-5 gap-5">
        <p className="flex text-4xl sm:text-5xl lg:text-6xl  font-bold -mb-5">
          Welcome to Edu<span className="text-sky-600">X</span>.
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl  text-center">
          School Management Made
          <span className="block text-sky-600">Simple &amp; Smart</span>
        </h1>
        <p className=" text-lg text-center max-w-[60ch]">
          Streamline student data, track attendance, and monitor performance
          with ease -- your one-stop solution for efficient school management.
        </p>

        <Button
          size="lg"
          className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
        >
          Get Started
          <CircleArrowRight size={20} />
        </Button>
      </div>
    </main>
  );
}
