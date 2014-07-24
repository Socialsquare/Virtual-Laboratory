import os
import os.path
import random

#runName = "run_01"
#runName = "run_random_samples"
#runName = "run_02"
runName = "run_03"

class Sidegroup:
    def __init__(self, smiles, name):
        self.smiles = smiles
        self.name = name


freeSideGroup = Sidegroup("[Zn]", "R")

sideGroups = []
sideGroups.append(freeSideGroup)
sideGroups.append(Sidegroup("CCCC", "4"))
sideGroups.append(Sidegroup("CCCCC", "5"))
sideGroups.append(Sidegroup("C(O)CC", "14"))
sideGroups.append(Sidegroup("CC(C)(C)O", "15"))
sideGroups.append(Sidegroup("CC(=O)CC", "21"))
sideGroups.append(Sidegroup("CCC(=O)C", "22"))
sideGroups.append(Sidegroup("COC(C)C", "32"))
sideGroups.append(Sidegroup("CNC", "43"))
sideGroups.append(Sidegroup("CCNC", "44"))
sideGroups.append(Sidegroup("CCCNC", "45"))
sideGroups.append(Sidegroup("CCCCNC", "46"))
sideGroups.append(Sidegroup("NCC", "52"))
sideGroups.append(Sidegroup("NCCO", "53"))
sideGroups.append(Sidegroup("NCC(O)C", "54"))

# Generate drugz
skip_counter = 0

for s0 in sideGroups:
    for s1 in sideGroups:
        for s2 in sideGroups:
            fileName = runName+"/scaffold_1_"+s0.name+"_"+s1.name+"_"+s2.name+".svg"
            if os.path.isfile(fileName):
                skip_counter = skip_counter + 1
                continue
            # IMPORTANT - note the order of the slots in the SMILES
            systemStr = "obabel -:\"N2("+s0.smiles+")N=CN1N=C("+s2.smiles+")C("+s1.smiles+")C12\" -O " + fileName + " -xi"
            os.system(systemStr)

print(skip_counter)

# Generate sidegroups

skip_counter = 0
counter = 0
for sg in sideGroups:
    counter = counter + 1
    if counter == 1:
        continue
    fileName = runName+"/sidegroup_"+sg.name+".svg"
    if os.path.isfile(fileName):
        skip_counter = skip_counter + 1
        continue
    os.system("obabel -:\"[Zn]"+sg.smiles+"\" -O "+ fileName)
    
print(skip_counter)

# # Find and replace [Zn] with R in drugz

for s0 in sideGroups:
    for s1 in sideGroups:
        for s2 in sideGroups:
            fileName = runName+"/scaffold_1_"+s0.name+"_"+s1.name+"_"+s2.name+".svg"
            f = open(fileName, 'r+')
            text = f.read()
            text = text.replace('>Zn<', '>R<')
            f.seek(0)
            f.write(text)
            f.truncate()
            f.close()

# # Fix ditto for sidegroups
counter = 0
for sg in sideGroups:
    counter = counter + 1
    if counter == 1:
        continue
    fileName = runName+"/sidegroup_"+sg.name+".svg"
    f = open(fileName, 'r+')
    text = f.read()
    text = text.replace('>Zn<', '>R<')
    f.seek(0)
    f.write(text)
    f.truncate()
    f.close()
