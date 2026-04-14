const jwt = require('jsonwebtoken');
const authMiddleware = require('../../src/middleware/authMiddleware');

// Mockoljuk a jsonwebtoken könyvtárat, hogy ne kelljen igazi tokeneket generálnunk
jest.mock('jsonwebtoken');

describe('Auth Middleware (Biztonsági kapu)', () => {
    let req, res, next;

    // Minden egyes teszt (it) előtt lenullázzuk és előkészítjük a hamis objektumokat
    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            // A mockReturnThis() azért kell, mert a kódunk láncolja: res.status(401).json(...)
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('401-es hibát kell adnia, ha egyáltalán nincs Authorization fejléc', () => {
        authMiddleware(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Nincs jogosultságod ehhez a művelethez! Hiányzó token.' });
        expect(next).not.toHaveBeenCalled(); // Nem engedheti tovább a kérést!
    });

    it('401-es hibát kell adnia, ha a token nem "Bearer "-rel kezdődik', () => {
        req.headers.authorization = 'HibasFormátum 123456';
        authMiddleware(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('401-es hibát kell adnia lejárt token esetén (TokenExpiredError)', () => {
        req.headers.authorization = 'Bearer lejart_token_123';
        
        // Szimuláljuk (mockoljuk), hogy a jwt.verify egy lejárt hibát dob
        const expiredError = new Error('jwt expired');
        expiredError.name = 'TokenExpiredError';
        jwt.verify.mockImplementation(() => { throw expiredError; });

        authMiddleware(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'A munkameneted lejárt. Kérlek jelentkezz be újra!' });
    });

    it('Tovább kell engednie (next) és beállítania a req.user-t egy tökéletes token esetén', () => {
        req.headers.authorization = 'Bearer tokeletes_token_123';
        const mockDecodedUser = { id: 99, role: 'driver' };
        
        jwt.verify.mockReturnValue(mockDecodedUser); // Szimuláljuk a sikeres dekódolást

        authMiddleware(req, res, next);
        
        expect(req.user).toEqual(mockDecodedUser); // A middleware beletette a user adatait a requestbe?
        expect(next).toHaveBeenCalled(); // Átengedte a biztonsági őr?
        expect(res.status).not.toHaveBeenCalled(); // Ugye nem dobott hibát?
    });
});