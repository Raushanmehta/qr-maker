import { Button } from "@/components/ui/button"

export default function BannerSection() {
  return (
    <section className="py-24  font-sans flex justify-center px-6">
      <div className="max-w-4xl w-full mx-auto p-12 rounded-xl text-center shadow-sm relative overflow-hidden" 
           style={{
             background: "linear-gradient(90deg, #E6F0E9 0%, #FFFFFF 50%, #E3ECE8 100%)"
           }}>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-2 relative z-10 tracking-tight">
          Generate a QR Code without leaving your tab
        </h2>
        
        <p className="text-gray-500 text-sm md:text-[15px] mb-6 relative z-10 max-w-2xl mx-auto">
          No more switching screens or copying links. Just tap the TQRCG Chrome Extension to create a QR Code with just a click.
        </p>
        
        <Button className="bg-[#60A068] hover:bg-[#4d8654] text-white font-medium px-6 py-5 rounded-md text-sm transition-colors relative z-10">
          Get the free QR Code Extension
        </Button>
      </div>
    </section>
  )
}
