package com.skullzuess.ecommerce.controller;

import java.util.*;
import java.util.stream.Collectors;


class Student{
    private int age;
    private String name;

    public Student(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "age=" + age +
                ", name='" + name + '\'' +
                '}';
    }
}
class ageComp implements Comparator<Student>{

    @Override
    public int compare(Student o1, Student o2) {
        return o1.getAge()-o2.getAge();
    }
}

public class Test {



    public static void main(String[] args){
        Student s1 = new Student(25,"ABC");
        Student s2 = new Student(20,"vbh");
        Student s3 = new Student(35,"hhh");
        List<Student> studentList = Arrays.asList(s1,s2,s3);
        for (Student s:studentList
             ) {
            if(s.getAge()>20)
                System.out.println(s.toString());

        }
        studentList.stream().filter(s ->s.getAge()>20).forEach(s-> System.out.println(s.toString()));
        Collections.sort(studentList,new ageComp());
        studentList.stream().forEach(s -> System.out.println("comparator:-"+s.toString()));
    }





}
class Solution {
    void pushZerosToEnd(int[] arr) {
        List<Integer> lst = new ArrayList(Arrays.asList(arr));
        for(int i=0;i<lst.size();i++){
            if(lst.get(i)==0){
                lst.remove(i);
                lst.add(0);

            }

        }

        // code here
    }
}
class NumberOfDaysInMonth {
    public static boolean isLeapYear(int year){
        if(year>0 && year<=9999){
            if(year%400==0){
                return true;
            }else if(year/4 == 0 && year%100!=0){
                return true;
            }else
                return false;
        }else{
            return false;
        }
    }
    public static int getDaysInMonth(int month, int year){
        if(month>0 && month<=12 && year>=1 && year <=9999){
            return switch(month){
                case 1 -> 31;
                case 2 -> {
                    if(isLeapYear(year)){
                        yield 29;
                    }else{
                        yield 28;
                    }
                }
                case 3 -> 31;
                case 4 -> 30;
                case 5 -> 31;
                case 6 -> 30;
                case 7 -> 31;
                case 8 -> 31;
                case 9 -> 30;
                case 10 -> 31;
                case 11 -> 30;
                case 12 -> 31;
                default -> -1;
            };
        }else{
            return -1;
        }
    }
    // write code here
}