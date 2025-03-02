export function calculateTimeLeft(endsAt) {
    if (!endsAt) return "No end date";
    
    const now = new Date();
    const endDate = new Date(endsAt);
    const timeLeft = endDate - now;
  
    if (timeLeft <= 0) return "Expired";
  
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${days}d ${hours}h ${minutes}m left`;
  }