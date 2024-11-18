export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-4xl font-bold text-gray-800">404 - Страница не найдена</h1>
            <p className="mt-4 text-gray-600">
                К сожалению, мы не можем найти страницу, которую вы ищете.
            </p>
            <a href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Вернуться на главную
            </a>
        </div>
    );
}