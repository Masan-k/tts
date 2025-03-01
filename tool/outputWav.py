from TTS.api import TTS
import json

with open('contents.json', 'r', encoding='utf-8') as file:
    data = json.load(file)  # JSONデータを読み込む

tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")

for index, content in enumerate(data):  # enumerateでインデックスも取得可能
    if(content["code"] == '98' or content["code"] == '99' or content["code"] == '100'):
        print(index);
    #print(content['en'])
    #print(content["code"] + '.wav')
        tts.tts_to_file(text=content['en'], file_path= content["code"]+'.wav')

#print(data)
# モデルを指定
# テキストを音声に変換して保存

