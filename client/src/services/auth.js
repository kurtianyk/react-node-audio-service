import decode from 'jwt-decode';

export default class AuthService {
    loggedIn = () => {
        const token = this.getToken();

        return Boolean(token) && !this.isTokenExpired(token);
      };
    
      isTokenExpired = (token) => {
        try {
          const decoded = decode(token);
          return decoded.exp < Date.now() / 1000;
        } catch (err) {
          return true;
        }
      };
    
      setToken = token => localStorage.setItem('jwtToken', token);
    
      getToken = () => localStorage.getItem('jwtToken');
    
      logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.clear();
      };
}
