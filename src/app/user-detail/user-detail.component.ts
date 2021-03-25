import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  public userid;
  public firstName;
  public lastName;
  public city;
  public phone;
  public email;
  public amount;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  checkout(): any {
      this.userid = (document.getElementById('unique_id') as HTMLInputElement).value;
      this.firstName = (document.getElementById('firstName') as HTMLInputElement).value;
      this.lastName = (document.getElementById('lastName') as HTMLInputElement).value;
      this.city = (document.getElementById('city') as HTMLInputElement).value;
      this.phone = (document.getElementById('phone') as HTMLInputElement).value;
      this.email = (document.getElementById('email') as HTMLInputElement).value;
      this.amount = (document.getElementById('amount') as HTMLInputElement).value;
      let body: any;

      const hh = {headers: {
          'Content-Type':  'application/json',
          Authorization:  'Basic cHJpdmF0ZS03NzUxOkItcWEyLTAtNWYwMzFjZGQtMC0zMDJkMDIxNDQ5NmJlODQ3MzJhMDFmNjkwMjY4ZDNiOGViNzJlNWI4Y2NmOTRlMjIwMjE1MDA4NTkxMzExN2YyZTFhODUzMTUwNWVlOGNjZmM4ZTk4ZGYzY2YxNzQ4'
        }
      };
      // first chech user exist or not
      this.http.post<any>('http://localhost:8000/check/', this.userid, hh)
          .subscribe(
              res => {
                  console.log(res);
                  if (res.message === 'customer Not found') {
                      console.log('This custumer details not saved');
                      // then simpley do payment
                      paysafe.checkout.setup('cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=',
                      body = {
                          currency: 'USD',
                          amount: this.amount * 100,
                          locale: 'en_US',
                          customer: {
                              firstName: this.firstName,
                              lastName: this.lastName,
                              email: this.email,
                              phone: this.phone,
                              dateOfBirth: {
                                  day: 1,
                                  month: 7,
                                  year: 1990
                              }
                          },
                          billingAddress: {
                              nickName: this.firstName + ' ' + this.lastName,
                              street: '20735 Stevens Creek Blvd', // i am taking now only city
                              street2: 'Montessori',
                              city: this.city,
                              zip: '95014',
                              country: 'US',
                              state: 'CA'
                          },
                          environment: 'TEST',
                          merchantRefNum: '1559900597607',
                          canEditAmount: true,
                          merchantDescriptor: {
                              dynamicDescriptor: 'XYZ',
                              phone: '1234567890'
                              },
                          displayPaymentMethods: ['skrill', 'card'],
                          paymentMethodDetails: {
                              paysafecard: {
                                  consumerId: '1232323'
                              },
                              paysafecash: {
                                  consumerId: '123456'
                              },
                              sightline: {
                                  consumerId: '123456',
                                  SSN: '123456789',
                                  last4ssn: '6789',
                                  accountId: '1009688222'
                              },
                              vippreferred: {
                                  consumerId: '550726575',
                                  accountId: '1679688456'
                              }
                          }
                      }, (instance, error, result) =>
                      {
                          if (result && result.paymentHandleToken) {
                              console.log(result.paymentHandleToken);
                              console.log(result);
                              const dd = {
                                  amount: this.amount * 100,
                                  currencyCode: 'USD',
                                  description: 'payment Assignment',
                                  merchantCustomerId: this.userid,
                                  merchantRefNum: Math.floor(Math.random() * 1000000000),
                                  paymentHandleToken: result.paymentHandleToken
                              };

                              this.http.post<any>('http://localhost:8000/makpayment/', dd, hh)
                                  .subscribe(
                                      mpresult => {
                                          console.log(mpresult);
                                          instance.showSuccessScreen();
                                      },
                                      err => {
                                          console.log(err);
                                          instance.showFailureScreen(err.message);
                                      }
                                  );
                          } else {
                              console.error(error);
                              instance.showFailureScreen(error.message);
                          }
                          console.log(instance);
                      }, (stage, expired) =>
                      {
                          switch (stage) {
                              case 'PAYMENT_HANDLE_NOT_CREATED': // Handle the scenario
                              case 'PAYMENT_HANDLE_CREATED': // Handle the scenario
                              case 'PAYMENT_HANDLE_REDIRECT': // Handle the scenario
                              case 'PAYMENT_HANDLE_PAYABLE': // Handle the scenario
                              default: // Handle the scenario
                          }
                      }
                      );
                  } else {
                      console.log(res.id);
                      // now call for find single user token
                      const tt = {
                          token: res.id,
                          data: {
                              merchantRefNum: res.merchantRefNum,
                              paymentTypes: [
                                'CARD'
                              ]
                            }
                      };
                      this.http.post<any>('http://localhost:8000/gettoken/', tt, hh).subscribe(
                          findtoken => {
                              paysafe.checkout.setup('cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=',
                              body = {
                                  currency: 'USD',
                                  amount: this.amount * 100,
                                  singleUseCustomerToken: findtoken.singleUseCustomerToken,
                                  locale: 'en_US',
                                  customer: {
                                      firstName: res.firstName,
                                      lastName: res.lastName,
                                      email: res.email,
                                      phone: res.phone,
                                      dateOfBirth: {
                                          day: 1,
                                          month: 7,
                                          year: 1990
                                      }
                                  },
                                  billingAddress: {
                                      nickName: this.firstName + ' ' + this.lastName,
                                      street: '20735 Stevens Creek Blvd', // i am taking now only city
                                      street2: 'Montessori',
                                      city: this.city,
                                      zip: '95014',
                                      country: 'US',
                                      state: 'CA'
                                  },
                                  environment: 'TEST',
                                  merchantRefNum: '1559900597607',
                                  canEditAmount: true,
                                  merchantDescriptor: {
                                      dynamicDescriptor: 'XYZ',
                                      phone: '1234567890'
                                      },
                                  displayPaymentMethods: ['skrill', 'card'],
                                  paymentMethodDetails: {
                                      paysafecard: {
                                          consumerId: '1232323'
                                      },
                                      paysafecash: {
                                          consumerId: '123456'
                                      },
                                      sightline: {
                                          consumerId: '123456',
                                          SSN: '123456789',
                                          last4ssn: '6789',
                                          accountId: '1009688222'
                                      },
                                      vippreferred: {
                                          consumerId: '550726575',
                                          accountId: '1679688456'
                                      }
                                  }
                              }, (instance, error, result) =>
                              {
                                  if (result && result.paymentHandleToken) {
                                      console.log(result.paymentHandleToken);
                                      console.log(result);
                                      const dd = {
                                          amount: this.amount * 100,
                                          currencyCode: 'USD',
                                          // add here customer id
                                          customerId: findtoken.id,
                                          description: 'payment Assignment',
                                          merchantCustomerId: this.userid,
                                          paymentHandleToken: result.paymentHandleToken
                                      };
                                      // payment for saved card
                                      this.http.post<any>('http://localhost:8000/userexist/', dd, hh)
                                          .subscribe(
                                              resu => {
                                                  console.log(resu);
                                                  instance.showSuccessScreen();
                                              },
                                              err => {
                                                  console.log(err);
                                                  instance.showFailureScreen(err.message);
                                              }
                                          );
                                  } else {
                                      console.error(error);
                                      instance.showFailureScreen(error.message);
                                  }
                                  console.log(instance);
                              }, (stage, expired) =>
                              {
                                  switch (stage) {
                                      case 'PAYMENT_HANDLE_NOT_CREATED': // Handle the scenario
                                      case 'PAYMENT_HANDLE_CREATED': // Handle the scenario
                                      case 'PAYMENT_HANDLE_REDIRECT': // Handle the scenario
                                      case 'PAYMENT_HANDLE_PAYABLE': // Handle the scenario
                                      default: // Handle the scenario
                                  }
                              }
                              );
                          }
                      );
                  }
              },
              err => {
                  console.log(err);
              }
          );
  }
}
