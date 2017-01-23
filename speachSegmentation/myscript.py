import sys
import unicodedata
from separadorSilabas import *
import string
import re
""" Normalise (normalize) unicode data in Python to remove umlauts, accents etc. """


for line in sys.stdin:
    phrases = unicodedata.normalize('NFKD', line.lower().decode('utf-8')).encode('ASCII', 'ignore').split(',')
    offset = 0.0
    for phrase in phrases:
        sentence = '-'.join([silabas(word) for word in phrase.translate(None, string.punctuation).split()])

        #print sentence

        syllables = sentence.split('-')
        for x in range(len(syllables)):
        #print syllables[x]
            print "%s %s %f" %(syllables[x],re.findall('[aeiouy]', syllables[x])[-1], x*0.20+offset)
        offset+=x*0.20+0.25
    #print line.lower()
