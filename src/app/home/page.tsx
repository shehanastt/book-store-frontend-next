"use client"

import AutoSlider from "@/components/AutoSlider"

const HomePage = () => {

    const categories = [
      'Fiction',
      'Non-fiction',
      'Children',
      'Romance',
      'Thriller',
      'Academic',
      ];

    return(
        <div>
            <AutoSlider/>
            <section className="py-15 px-4 flex flex-col items-center gap-6"
            style={{backgroundColor: "#99760398"}}>
            {/* Glass-morphism Card with Quote */}
            <div className="backdrop-blur-md bg-white/30 border border-white/30 shadow-lg rounded-xl p-6 max-w-3xl text-center">
                <p className="italic text-lg md:text-xl font-medium" style={{color: '#493905c9'}}>
                “A reader lives a thousand lives before he dies.” <br />
                <span className="not-italic text-sm mt-1 block">– George R.R. Martin</span>
                </p>
            </div>

           {/* Welcome Card with Login/Register Buttons */}
            <div className="mt-4 w-full max-w-xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-brown-800 mb-4" style={{color: '#413305e8'}}>Welcome to KITHAAB</h2>
            <p className="text-brown-700 mb-6" style={{color: '#493905c9'}}>
                Discover your next favorite book. Join us to explore, shop, and connect with fellow book lovers!
            </p>
            <div className="flex justify-center gap-4">
                <a
                href="/registration"
                style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#8b6e5c',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c4433'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b6e5c'}
                >
                Register
                </a>

                <a
                href="/login"
                className="px-6 py-2 border border-brown-600 text-brown-700 rounded-full font-medium hover:bg-brown-100 transition"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c4433'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                Login
                </a>
            </div>
            </div>
            </section>
        </div>
    )
}

export default HomePage