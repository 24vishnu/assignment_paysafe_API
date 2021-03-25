import json
from urllib import request

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# this for first hit to check user is saved or not
@csrf_exempt
def user_validation(req):
    headers = {
        'Content-Type': req.headers['Content-Type'],
        'Authorization': req.headers['Authorization']
    }
    url = 'https://api.test.paysafe.com/paymenthub/v1/customers'
    # check customer is created or not
    c_data = (req.body).decode('utf-8')
    try:
        response_body = request.Request(url + '?merchantCustomerId=' + c_data, headers=headers)
        response_body = request.urlopen(response_body).read()
    except Exception as e:
        # create new customer
        print(e)
        return JsonResponse({'success': True, 'message': 'customer Not found', 'status': 404})

    return JsonResponse(
        json.loads(response_body)
    )


# for get single user token
@csrf_exempt
def get_token(req):
    headers = {
        'Content-Type': req.headers['Content-Type'],
        'Authorization': req.headers['Authorization']
    }
    body = json.loads(req.body)
    token = body['token']
    data = json.dumps(body['data']).encode('utf-8')
    url = 'https://api.test.paysafe.com/paymenthub/v1/customers/' + token + '/singleusecustomertokens'
    api_result = request.Request(url, data=data, headers=headers)
    response_body = request.urlopen(api_result).read()
    return JsonResponse(
        json.loads(response_body)
    )


# id user saved then get details from paysafe database
@csrf_exempt
def exist_user(req):
    headers = {
        'Content-Type': req.headers['Content-Type'],
        'Authorization': req.headers['Authorization']
    }
    body = json.loads(req.body)
    url = 'https://api.test.paysafe.com/paymenthub/v1/singleusecustomertokens/' + body['customerId']
    api_result = request.Request(url, headers=headers, method='GET')
    response_body = request.urlopen(api_result).read()
    return JsonResponse(
        json.loads(response_body)
    )

# make payment if user not present in database then after fill card details else exist details
@csrf_exempt
def payment(req):
    headers = {
        'Content-Type': req.headers['Content-Type'],
        'Authorization': req.headers['Authorization']
    }
    api_result = request.Request('https://api.test.paysafe.com/paymenthub/v1/payments', data=req.body, headers=headers)
    response_body = request.urlopen(api_result).read()
    print(response_body)
    return JsonResponse(
        json.loads(response_body)
    )

