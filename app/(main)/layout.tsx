import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </>
    )
}

export default layout