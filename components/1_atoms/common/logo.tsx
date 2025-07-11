export function Logo() {
  return (
    <div className="flex items-center space-x-3 justify-center">
      <svg viewBox="0 0 100 100" className="w-10 h-10" role="img">
        <path d="M50 15 L10 45 L20 45 L20 85 L80 85 L80 45 L90 45 Z" fill="#bae6fd" />
        <path
          d="M50,30 C40,20 20,25 20,45 C20,65 50,80 50,80 C50,80 80,65 80,45 C80,25 60,20 50,30 Z"
          fill="#0891b2"
        />
      </svg>
      <span className="text-3xl font-bold logo-font text-gray-800">CareBase</span>
    </div>
  );
}
