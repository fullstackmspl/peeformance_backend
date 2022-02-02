use strict;
use warnings;

sub main {
    # Note: this could be a full file path
    my $filename = "file.csv";


    open(INPUT, $filename) or die "Cannot open $filename"; # reading the csv
    my $outputFilename = "output.txt";
    open(FH, '>>', $outputFilename) or die $!; # writing



    # Read the header line.
    my $line = <INPUT>;
    my $level_1_parent = "NULL";
    my $level_2_parent = undef;
    my $level_3_parent = undef;
    my $level_4_parent = undef;
    my $level_5_parent = undef;
    my $level_6_parent = undef;

    my $level_1_counter = 1;
    my $level_2_counter = 1;
    my $level_3_counter = 1;
    my $level_4_counter = 1;
    my $level_5_counter = 1;

    # Read the lines one by one.
    while ($line = <INPUT>) {
        # Level 1
        if ($line =~ /^ ([A-Z]+),\"*([a-zA-Z0-9 ,;\/\(\)\.-]*)\"*,,,,,,,,,,,,,,,,,,/) {
            # Just display the line for now.
            $level_2_parent = $1;
            my $insert = "insert into Categories (SIC, ParentSIC, Category,Level) values ('" .$level_1_parent.$1 ."'," .$level_1_parent .",'" .$2 ."',1)\n";
            print FH $insert;
            $level_1_counter++;
            # $level_1_parent = undef; # we reassign the variable once we have finished with it
        }
        # Level 2
        # ^,,([0-9]+),(?:\"([a-zA-Z0-9 ,;\/\(\)\.-]*)\"|([a-zA-Z0-9 ;\/\(\)\.-]*)).*
        elsif ($line =~ /^,,([0-9]+),\"*([a-zA-Z0-9 ,;\/\(\)\.-]*)\"*,,,,,,,,,,,,,,,,/) {
            $level_3_parent = $1;
            my $insert = "insert into Categories (SIC, ParentSIC, Category,Level) values ('" .$level_1_parent.$1 ."','" .$level_2_parent ."','" .$2 ."',2)\n";
            print FH $insert;
            $level_2_counter++;
            # $level_2_parent = undef; # we reassign the variable once we have finished with it
        }
        # Level 3
        elsif ($line =~ /^,,,,([0-9]+).([0-9]+),\"*([a-zA-Z0-9 ,;\/\(\)\.-]*)\"*,,,,,,,,,,,,,,/) {
            $level_4_parent = $1;
            my $insert = "insert into Categories (SIC, ParentSIC, Category,Level) values ('" .$level_1_parent.$1 . "','" .$level_3_parent . "','" .$2 . "',3)\n";
            #print $insert;
            $level_3_counter++;
            $level_3_parent = undef; # we reassign the variable once we have finished with it
        }
        # Level 4
        elsif ($line =~ /^,,,,,,([0-9]+).([0-9]+),\"*([a-zA-Z0-9 ,;\/\(\)\.-]*)\"*,,,,,,,,,,,,/) {
            $level_5_parent = $1;
            my $insert = "insert into Categories (SIC, ParentSIC, Category,Level) values ('" .$level_1_parent.$1 . "','" .$level_4_parent . "','" .$2 . "',4)\n";
            #print $insert;
            $level_4_counter++;
            $level_4_parent = undef; # we reassign the variable once we have finished with it
        }
        # # Level 5
        elsif ($line =~ /^,,,,,,,,([0-9]+).([0-9]+)\/([0-9]+),\"*([a-zA-Z0-9 ,;\/\(\)\.-]*)\"*,,,,,,,,,,/) {
            my $insert = "insert into Categories (SIC, ParentSIC, Category,Level) values ('" .$level_1_parent.$1 . "','" .$level_5_parent . "','" .$2 . "',5)\n";
            #print $insert;
            $level_5_counter++;
            $level_5_parent = undef; # we reassign the variable once we have finished with it
        }
        else {
            # print "Hello\n"
            print($line);
        }
    }
    close(INPUT);
    close(FH);
    my $total = $level_1_counter + $level_2_counter + $level_3_counter + $level_4_counter + $level_5_counter;
    print("This is the total: " . $total . "\n")
}

main();


