import exciting from "../../assets/exciting.png";
import hardwork from "../../assets/hardwork.png";
import alone from "../../assets/alone.png";

export default function StorySection() {
    return (
        <section className="w-full">
            {/* Main heading and subheading */}
            <div className="py-16 px-8 text-center">
                <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "64px",
                    lineHeight: "160%",
                    letterSpacing: "0%",
                    color: "#000000"
                }}>
                    Everyone starts as a beginner
                </h2>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "24px",
                    lineHeight: "160%",
                    letterSpacing: "0%",
                    color: "#000000",
                    textAlign: "center",
                }}>
                    You don't have to be perfect to share your knowledge. Start with what you know.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Top Left - Purple Section */}
                <div className="bg-[#B23386] py-20 px-8 flex items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-center" style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "40px",
                        lineHeight: "160%",
                        letterSpacing: "0%",
                        color: "#000000"
                    }}>
                        Don't know where to start?
                    </h2>
                </div>

                {/* Top Right - Pink Section */}
                <div className="bg-[#FF90E8] py-20 px-8 flex items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-center" style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "40px",
                        lineHeight: "160%",
                        letterSpacing: "0%",
                        color: "#000000"
                    }}>
                        Learn with others. That's exciting!
                    </h2>
                </div>

                {/* Bottom Left - Black Section with Image */}
                <div className="bg-[#000000] h-[520px] flex items-center justify-center">
                    <div className="relative">
                        {/* Image container */}
                        <div className="w-80 h-80 bg-yellow-400 rounded-full overflow-hidden">
                            <img
                                src={hardwork}
                                alt="Person working hard on laptop"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Speech bubble positioned at the top left of the image */}
                        <div
                            className="absolute z-10"
                            style={{
                                top: "-20px",
                                left: "-120px",
                            }}
                        >
                            <div
                                className="bg-white flex items-center justify-center"
                                style={{
                                    width: "300px",
                                    height: "55px",
                                    borderRadius: "22px",
                                    border: "1px solid #000000",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        lineHeight: "160%",
                                        letterSpacing: "0%",
                                        textAlign: "center",
                                    }}
                                >
                                    Instead of doing it all at once...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Right - Yellow Section with Image */}
                <div className="bg-[#FFC900] h-[520px] flex items-center justify-center relative">
                    <div className="relative">
                        {/* Image container */}
                        <div className="border-black w-80 h-80">
                            <img
                                src={alone}
                                alt="Person sitting under a tree"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Speech bubble positioned at the top left of the image */}
                        <div
                            className="absolute z-10"
                            style={{
                                top: "-20px",
                                left: "-120px",
                            }}
                        >
                            <div
                                className="bg-white flex items-center justify-center"
                                style={{
                                    width: "300px",
                                    height: "55px",
                                    borderRadius: "22px",
                                    border: "1px solid #000000",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        lineHeight: "160%",
                                        letterSpacing: "0%",
                                        textAlign: "center",
                                    }}
                                >
                                    ...do it bit by bit, and let it grow.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Exciting sticker */}
                    <div className="absolute top-110 right-36 transform rotate-6">
                        <img
                            src={exciting} ß
                            alt="Exciting sticker"
                            className="w-50 h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
