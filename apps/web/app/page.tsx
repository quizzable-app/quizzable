import dynamic from "next/dynamic";
const SignInButton = dynamic(() => import("@components/SignInButton"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-[50vh]">
      <h1 className="text-3xl font-bold underline text-center">Hello world!</h1>
      <SignInButton />
    </div>
  );
}
