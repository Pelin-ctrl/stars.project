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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-200 min-h-screen">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border border-gray-400 w-6 h-6 top-1 left-1"></div>
              <div className="absolute inset-0 bg-gray-800 w-6 h-6 transform rotate-45 top-1 left-1"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-black">ИНДУСТИАЛЬНЫЕ</div>
              <div className="text-xs text-gray-600">данные Москвы</div>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="bg-gray-300 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-sm">Дашборд</span>
            </div>
            <div className="px-3 py-2 rounded flex items-center gap-2 text-gray-600 hover:bg-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Данные о компаниях</span>
            </div>
            <div className="px-3 py-2 rounded flex items-center gap-2 text-gray-600 hover:bg-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 17v-2.25A2.25 2.25 0 0011.25 12h2.5A2.25 2.25 0 0016 14.25V17M9 17H7a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2M9 17v-10" />
              </svg>
              <span className="text-sm">Отчеты</span>
            </div>
            <div className="px-3 py-2 rounded flex items-center gap-2 text-gray-600 hover:bg-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Настройки</span>
            </div>
            <div className="px-3 py-2 rounded flex items-center gap-2 text-gray-600 hover:bg-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Помощь</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Дашборд</h1>
          <div className="flex items-center gap-4">
            <button className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Сформировать отчет
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-200">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              
              <div className="relative">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">1</span>
                </div>
              </div>
              
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative">
              <select className="bg-white border border-gray-300 text-black px-4 py-2 rounded-md appearance-none cursor-pointer pr-8">
                <option>Выберите отрасль</option>
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

            <div className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md">
              <span className="text-sm">30 дней</span>
              <span className="text-sm text-gray-500">
                Сент 12/23 - Нояб 12/23
              </span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

            <div className="lg:col-span-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-400 p-6 rounded-lg"></div>
                <div className="bg-gray-400 p-6 rounded-lg"></div>
              </div>

              <div className="bg-gray-300 h-64 rounded-lg"></div>
            </div>
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
