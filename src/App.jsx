import { useState, useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [selectedFormat, setSelectedFormat] = useState("api");
  const [targetPage, setTargetPage] = useState("");

  useEffect(() => {
    if (currentPage === "success") {
      const timer = setTimeout(() => {
        setCurrentPage("welcome");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleSubmit = () => {
    setCurrentPage("success");
  };

  const handleAuthRequest = (destination) => {
    setTargetPage(destination);
    setCurrentPage("auth");
  };

  const handleLogin = () => {
    setCurrentPage(targetPage);
  };

  const WelcomePage = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-16">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-400 w-12 h-12 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-12 h-12 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-black">ИНДУСТИАЛЬНЫЕ</h1>
          <p className="text-lg text-gray-600">данные Москвы</p>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Добро пожаловать
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-black">
          в Индустиальные данные Москвы
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleAuthRequest("dashboard")}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Руководству ДИПП
        </button>
        <button
          onClick={() => handleAuthRequest("enterprise")}
          className="bg-white text-black border-2 border-gray-300 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Партнерам
        </button>
      </div>
    </div>
  );

  const AuthPage = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-16">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-400 w-12 h-12 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-12 h-12 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-black">ИНДУСТИАЛЬНЫЕ</h1>
          <p className="text-lg text-gray-600">данные Москвы</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-black text-center mb-12">
          Авторизация
        </h2>

        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Логин"
            className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleLogin}
            className="bg-black text-white px-12 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Войти
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            Забыли пароль?
          </button>
        </div>
      </div>
    </div>
  );

  const EnterprisePage = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black text-center mb-12">
          Индустиальные данные Москвы
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Введите данные предприятия
            </h2>

            <div className="mb-4">
              <div className="relative">
                <select className="w-full bg-gray-200 text-black px-4 py-3 rounded-md appearance-none cursor-pointer">
                  <option>выберите отрасль</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Название предприятия"
                className="w-full bg-gray-200 text-gray-500 px-4 py-3 rounded-md placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Выберите формат загрузки данных
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => setSelectedFormat("api")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "api"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                API
              </button>
              <button
                onClick={() => setSelectedFormat("excel")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "excel"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Excel
              </button>
              <button
                onClick={() => setSelectedFormat("manual")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "manual"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Ручной ввод
              </button>
            </div>

            {selectedFormat === "api" && (
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="введите API ключ"
                  className="w-full bg-gray-200 text-black px-4 py-3 rounded-md border-2 border-black placeholder-gray-600"
                />
              </div>
            )}

            {selectedFormat === "excel" && (
              <div className="mb-8">
                <div className="w-full bg-gray-200 px-4 py-8 rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gray-600 rounded mr-3 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-black font-medium">
                      прикрепите файл
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white px-12 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessPage = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black text-center mb-12">
          Индустиальные данные Москвы
        </h1>

        <div className="bg-gray-300 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Спасибо!</h2>
          <p className="text-2xl text-black">Данные загружены успешно</p>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Дашборд</h1>

        <div className="flex gap-4 mb-8">
          <div className="relative">
            <select className="bg-gray-200 text-black px-4 py-2 rounded-md appearance-none cursor-pointer pr-8">
              <option>выберите отрасль</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select className="bg-gray-200 text-black px-4 py-2 rounded-md appearance-none cursor-pointer pr-8">
              <option>за квартал</option>
              <option>за месяц</option>
              <option>за год</option>
              <option>за 5 лет</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-300 h-48 rounded-lg"></div>
              <div className="bg-gray-300 h-48 rounded-lg"></div>
              <div className="bg-gray-300 h-48 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-300 h-48 rounded-lg"></div>
              <div className="bg-gray-300 h-48 rounded-lg"></div>
              <div className="bg-gray-300 h-48 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-300 h-64 rounded-lg"></div>
              <div className="bg-gray-300 h-64 rounded-lg"></div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-400 p-6 rounded-lg"></div>
              <div className="bg-gray-400 p-6 rounded-lg"></div>
            </div>

            <div className="bg-gray-300 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentPage === "welcome") return <WelcomePage />;
  if (currentPage === "auth") return <AuthPage />;
  if (currentPage === "enterprise") return <EnterprisePage />;
  if (currentPage === "success") return <SuccessPage />;
  if (currentPage === "dashboard") return <DashboardPage />;

  return <WelcomePage />;
}

export default App;
