import Main from "@/components/main";
import Footer from "@/components/footer";
import config from "@/config"
import Header from "@/components/header";

export default function Home() {

    return (
        <div className="text-white max-w-[1170px] w-screen h-screen px-4 flex items-center justify-center flex-col gap-5">
            <Header />
            <Main socketServer={config.socketServer}/>
            <Footer/>
        </div>
    );
}
