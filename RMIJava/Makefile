# GNU Makefile
JAR=jar
JAVA=java
JAVAC=javac

JFLAGS = -g 
.SUFFIXES: .java .class
.java.class:
	$(JAVAC) $(JFLAGS) $*.java

CLASSES = \
	Client.java\
	IDatabase.java\
	IMatrix.java\
	ServerDatabase.java\
	ServerMatrix.java

default: classes

classes: $(CLASSES:.java=.class)

clean:
	rm -f *.class 
