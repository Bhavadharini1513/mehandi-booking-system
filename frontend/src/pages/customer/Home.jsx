import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-emerald-50">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <p className="text-emerald-600 font-semibold">MARUTHANI WORLD</p>

          <h1 className="text-5xl font-bold text-emerald-900 mt-3">
            Discover the Art of Mehandi
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-gray-600 text-lg">
            Find talented mehendi artists, explore beautiful designs and create
            memorable moments.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Link
              to="/artists"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Explore Artists
            </Link>

            <Link
              to="/become-artist"
              className="border border-emerald-600 text-emerald-700 hover:bg-emerald-100 px-6 py-3 rounded-lg font-semibold"
            >
              Become an Artist
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-emerald-800">
            About Maruthani World
          </h2>

          <p className="max-w-3xl mx-auto text-center text-gray-600 mt-5">
            Maruthani World connects customers with skilled mehendi artists for
            weddings, engagements, festivals and special occasions.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
