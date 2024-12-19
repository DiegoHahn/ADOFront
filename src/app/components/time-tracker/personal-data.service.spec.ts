import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PersonalDataService } from './personal-data.service';
import { UserInformation } from './user-information';

describe('PersonalDataService', () => {
    let service: PersonalDataService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:8080/userInformation';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PersonalDataService],
        });
        service = TestBed.inject(PersonalDataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('saveUserInfo', () => {
        it('should send POST request to save user info and return success message', () => {
            const mockUserInfo = {
                hasToken: true,
                email: 'user@example.com',
                board: 'default-board',
                userId: '123'
            };
            const mockResponse = 'User information saved successfully';

            service.saveUserInfo(mockUserInfo).subscribe(response => {
                expect(response).toBe(mockResponse);
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockUserInfo);
            req.flush(mockResponse);
        });

        it('should handle error when saving user info fails', () => {
            const mockUserInfo = {
              hasToken: true,
              email: 'user@example.com',
              board: 'default-board',
              userId: '123'
            };
          
            jest.spyOn(console, 'error').mockImplementation(() => {});
          
            service.saveUserInfo(mockUserInfo).subscribe({
              next: () => fail('Expected an error, but got a success response'),
              error: (error) => {
                expect(error).toBeTruthy();
                expect(error.status).toBe(500);
                expect(error.statusText).toBe('Internal Server Error');
              }
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            
            req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
          
            expect(console.error).toHaveBeenCalledWith(
              'Erro ao salvar ou atualizar dados:',
              expect.objectContaining({
                status: 500,
                statusText: 'Internal Server Error',
                error: 'Server error',
                url: apiUrl,
              })
            );
          
            (console.error as jest.Mock).mockRestore();
          });
    });

    describe('getUserInformation', () => {
        it('should send POST request to get user information and return UserInformation', () => {
            const mockEmail = 'user@example.com';
            const mockUserInformation: UserInformation = {
                hasToken: true,
                email: 'user@example.com',
                board: 'default-board',
                userId: '123'
            };

            service.getUserInformation(mockEmail).subscribe(response => {
                expect(response).toEqual(mockUserInformation);
            });

            const req = httpMock.expectOne(`${apiUrl}/details`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ email: mockEmail });
            req.flush(mockUserInformation);
        });
    });
});