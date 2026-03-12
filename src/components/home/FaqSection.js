import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  return (
    <section className="py-24  font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-500 tracking-tight">
          QR Codes explained
        </h2>

        <div className=" border text-left border-gray-800 rounded-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-800 px-6">
              <AccordionTrigger className="text-[15px] font-semibold text-gray-500 hover:no-underline py-5 text-left">
                What is a QR Code?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5 pr-6">
                A QR Code (Quick Response Code) is a two-dimensional barcode capable of storing various types of data such as website links, plain text, email addresses, and more. They can easily be scanned using modern smartphones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-800 px-6">
              <AccordionTrigger className="text-[15px] font-semibold text-gray-500 hover:no-underline py-5 text-left">
                Why do so many people use QR Codes in 2025?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5 pr-6">
                QR Codes provide a seamless way to connect physical and digital worlds. In 2025, they are heavily used for contactless menus, digital business cards, interactive marketing campaigns, and instant payments due to their incredible convenience and speed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="px-6 border-b-0">
              <AccordionTrigger className="text-[15px] font-semibold text-gray-500 hover:no-underline py-5 text-left">
                How do I scan one?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5 pr-6">
                Most modern smartphones have built-in QR code scanners in their native camera apps. Simply open your camera, point it at the QR Code, and tap the link or notification that pops up on your screen.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
