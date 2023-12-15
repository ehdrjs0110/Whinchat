def test1():
  print("111")
  
# test1()

import openai
#pip install --upgrade pip
#pip install openai

#js 연결인자
import sys

openai.api_key = "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"

def check(response, wrate = 1324.43,
          prompt_rate = 0.0015, completion_rate = 0.002):
  prompt_tokens = response['usage']['prompt_tokens']
  completion_tokens = response['usage']['completion_tokens']

  total_bill = prompt_tokens * prompt_rate / 1000 \
              + completion_tokens * completion_rate / 1000
  total_won = total_bill * wrate
  
  return total_won, total_bill, prompt_tokens, completion_tokens

def main(query):
  # print("start ")
  # prompt_input = "터치디자이너를 사용해서 화면 숨기는 액션을 추가하는 방법을 알려줘."
  # prompt_input = input("질문 >> ")
  # assistant_msg = "집 평수와 매매가를 알려줄게. 집1은 50평 6억, 집2는 30평 4억, 집3은 15평 1억, 집4는 45평 8억, 집5는 28평 3억, 집6은 19평 3억 이다."
  
  respons = openai.ChatCompletion.create(
    model = "gpt-3.5-turbo",
    messages = [
      # {'role':'user','content': prompt_input},
      {'role':'user','content': query},
      {'role':'system', 'content':'80자 내로 간략하게 부탁해'}
      # {'role':'assistant', 'content':assistant_msg}
    ]
  )
  
  print(respons['choices'][0]['message']['content'])
  
  total_won, total_bill, prompt_tokens, completion_tokens = check(respons)
  # print("내 돈 >> ",total_won,"   ", total_bill)
  # print(prompt_tokens, completion_tokens)        
  
  # return respons['choices'][0]['message']['content']

if __name__ == '__main__':
    main(sys.argv[1])                                                                                                                                                                  