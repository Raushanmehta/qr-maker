import { Button } from "@/components/ui/button"

export default function QrStepsSection() {

  const steps = [
    {
      id: 1,
      title: "Choose your QR Code type",
      desc: "Choose your QR Code type (static or dynamic) based on what you want it to do: open a URL, share a PDF, display a menu, share contact details, and more.",
      image: "https://images.unsplash.com/photo-1595079676601-f1adf3f0e9a3"
    },
    {
      id: 2,
      title: "Customize it your way",
      desc: "Add your details, change the color, style your QR Code, add a logo, and test it in real time before downloading.",
      image: "https://images.unsplash.com/photo-1581090700227-4c4f50f0b1d1"
    },
    {
      id: 3,
      title: "Download & share",
      desc: "Pick PNG, or SVG format, hit download, and you're all set to share it anywhere!",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e"
    }
  ]

  return (
    <section className="py-24  font-sans">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-[28px] font-bold text-center mb-24  tracking-tight">
          How to create a free QR Code in 3 simple steps
        </h2>

        <div className="relative">
          {/* vertical dashed line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-[2px] border-l-2 border-dashed border-gray-300 -translate-x-1/2"></div>

          <div className="flex flex-col space-y-24">
            {steps.map((step, index) => {
              // Even index (0, 2) => Text right, Image left
              // Odd index (1) => Text left, Image right
              const isTextRight = index % 2 === 0;

              return (
                <div key={step.id} className="relative flex items-center justify-between w-full">
                  
                  {/* Left Side */}
                  <div className="w-[45%] flex justify-end">
                    {isTextRight ? (
                      <div className="w-full max-w-[340px] flex justify-end mr-8">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto object-cover rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white aspect-[4/3]"
                        />
                      </div>
                    ) : (
                      <div className="text-right flex flex-col items-end max-w-[340px] pr-12">
                        <h3 className="font-semibold text-lg  mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-[15px] leading-relaxed">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#2d594f] text-white font-medium text-sm z-10 outline outline-[10px] outline-[#FAFAFA]">
                    {step.id}
                  </div>

                  {/* Right Side */}
                  <div className="w-[45%] flex justify-start">
                    {isTextRight ? (
                      <div className="text-left flex flex-col items-start max-w-[340px] pl-12">
                        <h3 className="font-semibold text-lg text-gray-500 mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-[15px] leading-relaxed">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="w-full max-w-[340px] flex justify-start ml-8">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto object-cover rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white aspect-[4/3]"
                        />
                      </div>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-24">
          <Button className="bg-[#60A068] hover:bg-[#4d8654] text-white font-medium px-8 py-6 rounded-md shadow-md text-base transition-colors">
            Create a free QR Code
          </Button>
        </div>
      </div>
    </section>
  )
}