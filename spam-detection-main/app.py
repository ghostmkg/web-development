import streamlit as st
import pandas as pd
import pickle
import os
import sklearn

model_file_name = 'MultinomialNB.pkl'
model_file_path = os.path.join(os.getcwd(), model_file_name)  # Get absolute path to the file

if os.path.exists(model_file_path):
    # Open the model file using the correct path
    with open(model_file_path, 'rb') as f:
        model = pickle.load(f)
else:
    # Handle case where file does not exist
    raise FileNotFoundError(f"{model_file_name} not found at {model_file_path}")

cv_file_name='CountVectorizer.pkl'
cv_file_path=os.path.join(os.getcwd(), cv_file_name)

if os.path.exists(cv_file_path):
    with open(cv_file_name, 'rb') as f:
        cv= pickle.load(f)
else:
    raise FileNotFoundError()

spam_bg = '''
    <style>
    .stApp {
        background-image: url("https://img.freepik.com/free-photo/2d-graphic-colorful-wallpaper-with-grainy-gradients_23-2151001504.jpg");
        background-repeat:no-repeat;
        background-size:100vw 100vh;
    }
    </style>
'''
ham_bg = '''
    <style>
    .stApp {
        background-image: url('https://img.freepik.com/free-vector/modern-soft-green-watercolor-texture-background_1055-18025.jpg');
        background-repeat:no-repeat;
        background-size:100vw 100vh;
    }
    </style>
'''
page_bg = '''
    <style>
    .stApp {
        background-image: url('https://img.freepik.com/free-vector/vibrant-pink-watercolor-painting-background_53876-58931.jpg');
        background-repeat:no-repeat;
        background-size:100vw 100vh;
    }
    </style>
'''
# st.markdown(page_bg, unsafe_allow_html=True)

print("Current working directory:", os.getcwd())
final=''
# model = pickle.load(open('MultinomialNB.pkl', 'rb'))
# cv = pickle.load(open('CountVectorizer.pkl','rb'))
ans=-1
def predict(sentence):
    st.session_state.clicked = True
    sen =[]
    sen.append(sentence)
    inp = cv.transform(sen)
    ans = model.predict(inp)

    if(ans[0] == 0):
        final="HAM."
        st.write("<h2 style='color:green'>HAM</h2>" , unsafe_allow_html=True)
        st.markdown(ham_bg, unsafe_allow_html=True)
    else:
        final="SPAM."
        st.markdown(spam_bg, unsafe_allow_html=True)
        st.write("<h2 style='color:red'>SPAM</h2>" , unsafe_allow_html=True)


st.title(":blue[SPAM or HAM Detection]")
st.write("<h4 style='color:blue'>Enter Your message</h4>" , unsafe_allow_html=True)
sentence= st.text_area("")
    

st.button("Predict", on_click= predict, args=(sentence,))

